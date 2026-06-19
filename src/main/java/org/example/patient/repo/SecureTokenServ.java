package org.example.patient.repo;


import org.example.patient.security.SecureToken;
import org.example.patient.security.User;

import java.util.Optional;

public interface SecureTokenServ {
    SecureToken createSecureToken(User user);
    Optional<SecureToken> findByToken(String token);
    void removeToken(String token);
}
