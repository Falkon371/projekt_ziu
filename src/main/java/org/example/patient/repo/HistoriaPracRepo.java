package org.example.patient.repo;

import org.example.patient.HistoriaPrac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;


@RepositoryRestResource
public interface HistoriaPracRepo extends JpaRepository<HistoriaPrac, Long> {
    void deleteByCzas(LocalDateTime czas);
}