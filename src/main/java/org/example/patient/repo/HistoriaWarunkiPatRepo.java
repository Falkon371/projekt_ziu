package org.example.patient.repo;

import java.time.LocalDateTime;

import org.example.patient.HistoriaWarunkiPatients;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface HistoriaWarunkiPatRepo extends JpaRepository<HistoriaWarunkiPatients, Long> {
    void deleteByCzas(LocalDateTime czas);
}
