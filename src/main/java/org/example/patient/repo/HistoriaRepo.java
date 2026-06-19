package org.example.patient.repo;

import java.time.LocalDateTime;

import org.example.patient.Historia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface HistoriaRepo extends JpaRepository<Historia, Long> {
    void deleteByCzas(LocalDateTime czas);
}
