package org.example.patient.repo;


import java.time.LocalDateTime;

import org.example.patient.HistoriaWarunkiPracownik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface HistoriaWarunkiPracRepo extends JpaRepository<HistoriaWarunkiPracownik, Long> {
    void deleteByCzas(LocalDateTime czas);
}
