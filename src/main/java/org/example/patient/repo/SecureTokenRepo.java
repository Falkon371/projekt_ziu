package org.example.patient.repo;

import org.example.patient.security.SecureToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface SecureTokenRepo extends JpaRepository<SecureToken, Long> {
    Optional<SecureToken> findByToken(String token);
}
