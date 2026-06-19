package org.example.patient.repo;

import org.example.patient.Pracownicy;
import org.example.patient.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface PracownikRepo extends JpaRepository<Pracownicy, Long> {
}