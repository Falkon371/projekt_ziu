package org.example.patient.security;


import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.example.patient.repo.SecureTokenRepo;
import org.example.patient.repo.SecureTokenServ;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SecureTokenService implements SecureTokenServ {

    @Autowired
    private SecureTokenRepo tokenRepo;

    public SecureTokenService() {
    }

    public SecureToken createSecureToken(User user) {
        SecureToken token = new SecureToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiredAt(LocalDateTime.now().plusHours(1));
        return tokenRepo.save(token);
    }

    public Optional<SecureToken> findByToken(String token) {
        return tokenRepo.findByToken(token);
    }

    public void removeToken(String token) {
        Optional<SecureToken> tokenOptional = tokenRepo.findByToken(token);
        tokenOptional.ifPresent(tokenRepo::delete);
    }
}
