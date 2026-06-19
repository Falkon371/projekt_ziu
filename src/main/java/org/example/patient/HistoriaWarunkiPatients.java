package org.example.patient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "historiaWarunkiPatients"
)
public class HistoriaWarunkiPatients {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    private String warunek;
    private Double wartosc;
    @Column(
            columnDefinition = "TIMESTAMP"
    )
    private LocalDateTime czas;

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWarunek() {
        return this.warunek;
    }

    public void setWarunek(String warunek) {
        this.warunek = warunek;
    }

    public Double getWartosc() {
        return this.wartosc;
    }

    public void setWartosc(Double wartosc) {
        this.wartosc = wartosc;
    }

    public LocalDateTime getCzas() {
        return this.czas;
    }

    public void setCzas(LocalDateTime czas) {
        this.czas = czas;
    }

    public HistoriaWarunkiPatients(long id, String warunek, Double wartosc, LocalDateTime czas) {
        this.id = id;
        this.warunek = warunek;
        this.wartosc = wartosc;
        this.czas = czas;
    }

    public HistoriaWarunkiPatients() {
    }
}