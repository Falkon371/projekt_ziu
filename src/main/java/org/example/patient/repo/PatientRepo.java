package org.example.patient.repo;

import org.example.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface PatientRepo extends JpaRepository<Patient, Long> {
}
