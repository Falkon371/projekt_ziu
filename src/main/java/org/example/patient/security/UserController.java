package org.example.patient.security;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(
        path = {"/auth"}
)
@CrossOrigin(
        origins = {"http://localhost:3000"}
)
@EnableScheduling
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final SecureTokenService secureTokenService;

    private record BucketEntry(Bucket bucket, Instant lastAccess) {}


    private final ConcurrentMap<String, BucketEntry> ipBuckets = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, BucketEntry> emailBuckets = new ConcurrentHashMap<>();

    private static final Duration BUCKET_EXPIRATION = Duration.ofMinutes(10);
    public UserController(UserService userService, PasswordEncoder passwordEncoder, SecureTokenService secureTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.secureTokenService = secureTokenService;

    }


    private Bucket newBucket(){
        return Bucket4j.builder()
                .addLimit(Bandwidth.classic(5, Refill.greedy(5,Duration.ofMinutes(1))))
                .build();
    }

    private Bucket resolveIpBucket(String ip) {
        return ipBuckets.compute(ip, (k, v) -> {
            if (v == null) return new BucketEntry(newBucket(), Instant.now());
            return new BucketEntry(v.bucket(), Instant.now());
        }).bucket();
    }

    private Bucket resolveEmailBucket(String email) {
        return emailBuckets.compute(email, (k, v) -> {
            if (v == null) return new BucketEntry(newBucket(), Instant.now());
            return new BucketEntry(v.bucket(), Instant.now());
        }).bucket();
    }

    @Scheduled(fixedRate = 60_000)
    public void cleanupBuckets(){
        Instant now = Instant.now();
        ipBuckets.entrySet().removeIf(e -> Duration.between(e.getValue().lastAccess(), now).compareTo(BUCKET_EXPIRATION) > 0);
        emailBuckets.entrySet().removeIf(e -> Duration.between(e.getValue().lastAccess(), now).compareTo(BUCKET_EXPIRATION) > 0);
    }

    @PostMapping({"/register"})
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        this.userService.registerUser(userDTO);
        return ResponseEntity.ok("Użytkownik zarejestrowany. Sprawdź e-mail i kliknij link aktywacyjny.");
    }

    @GetMapping({"/users"})
    public ResponseEntity<List<UserDTO>> getUsersAll() {
        List<UserDTO> users = this.userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping({"/register"})
    public ResponseEntity<?> getAllUsers(@RequestBody UserDTO userDTO) {
        userService.registerUser(userDTO);
        return ResponseEntity.ok("Użytkownik zarejestrowany. Sprawdź e-mail i kliknij link aktywacyjny.");
    }

    private Map<String, Object> buildRateLimitResponse(String message, long retry){
        return Map.of(
            "error", message,
            "retryAfter", retry
        );
    }

    @PostMapping({"/login"})
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        String email = loginDTO.getEmail();
        String ip = request.getRemoteAddr();

        if (!resolveIpBucket(ip).tryConsume(1)) {
            long waitTime = 60;
            return ResponseEntity
                    .status(429)
                    .body(buildRateLimitResponse(
                            "Zbyt wiele prób logowania dla tego IP. Spróbuj ponownie za minutę.",
                            waitTime
                    ));
        }

        if (!resolveEmailBucket(email).tryConsume(1)) {
            long waitTime = 60;
            return ResponseEntity
                    .status(429)
                    .body(buildRateLimitResponse(
                            "Zbyt wiele prób logowania dla tego adresu e-mail. Spróbuj ponownie za minutę.",
                            waitTime
                    ));
        }

        Optional<User> userOpt = this.userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Użytkownik nie istnieje");
        }

        User user = userOpt.get();

        if (user.getLoginBlockedUntil() != null && Instant.now().isBefore(user.getLoginBlockedUntil())) {
            long secondsLeft = Duration.between(Instant.now(), user.getLoginBlockedUntil()).toSeconds();
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Konto jest zablokowane. Spróbuj ponownie za " + secondsLeft + " sekund.");
        }

        if (!user.isAccountVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Konto nie jest jeszcze potwierdzone");
        }
        if (user.isLoginDisabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Konto jest zablokowane");
        }

        if (!this.passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

            if (user.getFailedLoginAttempts() >= 5) {
                user.setLoginBlockedUntil(Instant.now().plus(Duration.ofMinutes(1)));
            }

            this.userService.save(user);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidłowe hasło");
        }

        user.setFailedLoginAttempts(0);
        user.setLoginBlockedUntil(null);
        this.userService.save(user);

        SecureToken token = this.secureTokenService.createSecureToken(user);
        return ResponseEntity.ok(Map.of("token", token.getToken(), "role", user.getRole()));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam("token") String token){
        String result = userService.vaalidateVerificationToken(token);

        if(result.equals("valid")){
            return ResponseEntity.ok("Konto zostało pomyślnie zweryfikowane.");
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nieprawidłowy email");
        }

    }

}


