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
        name = "historiaPracPremii"
)
public class HistoriaPrac {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    @Column(
            name = "name"
    )
    private String imie;
    private Double premia;
    @Column(
            name = "czas"
    )
    private LocalDateTime czas;

    public HistoriaPrac() {
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImie() {
        return this.imie;
    }

    public void setImie(String imie) {
        this.imie = imie;
    }

    public Double getPremia() {
        return this.premia;
    }

    public void setPremia(Double premia) {
        this.premia = premia;
    }

    public LocalDateTime getCzas() {
        return this.czas;
    }

    public void setCzas(LocalDateTime czas) {
        this.czas = czas;
    }

    public HistoriaPrac(long id, String imie, Double premia, LocalDateTime czas) {
        this.id = id;
        this.imie = imie;
        this.premia = premia;
        this.czas = czas;
    }
}
