package org.example.patient.security;

import org.example.patient.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public void save(User user) {
        userRepo.save(user);
    }


    public List<UserDTO> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        null, // don't expose password
                        user.getName(),
                        user.getUsername(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersAll() {
        return getAllUsers();
    }

    public void registerUser(UserDTO userDTO) {
        User user = new User(
                null,
                userDTO.getEmail(),
                passwordEncoder.encode(userDTO.getPassword()),
                userDTO.getName(),
                userDTO.getUserName(),
                "user"
        );
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);

        String confirmationUrl = "http://localhost:8081/auth/verify-email?token=" + token;
        emailService.sendEmail(user.getEmail(),
                "Email Verification",
                "Click the link to verify your email:" + confirmationUrl);

        user.setAccountVerified(false);
        userRepo.save(user);
    }

    public String vaalidateVerificationToken(String token){
        User user = userRepo.findByVerificationToken(token).orElse(null);
        if(user == null){
            return "invalid";
        }
        user.setAccountVerified(true);
        user.setVerificationToken(null);
        userRepo.save(user);
        return "valid";
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
