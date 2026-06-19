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
        name = "historiapremii"
)
public class Historia {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    private String name;
    private Double premia;
    @Column(
            name = "czas"
    )
    private LocalDateTime czas;

    public Historia() {
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Historia(long id, String name, Double premia, LocalDateTime czas) {
        this.id = id;
        this.name = name;
        this.premia = premia;
        this.czas = czas;
    }
}
