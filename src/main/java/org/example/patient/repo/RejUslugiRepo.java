package org.example.patient.repo;

import org.example.patient.RejUslugi;
import org.example.patient.security.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface RejUslugiRepo extends JpaRepository<RejUslugi, Long> {
}
