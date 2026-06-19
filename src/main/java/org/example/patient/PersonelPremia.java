package org.example.patient;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "premie"
)
public class PersonelPremia {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    private String pracownik;
    private Double premia;
    private LocalDateTime premiaDate;

    public void setId(Long id) {
        this.id = id;
    }

    public void setPracownik(String pracownik) {
        this.pracownik = pracownik;
    }

    public void setPremia(Double premia) {
        this.premia = premia;
    }

    public void setPremiaDate(LocalDateTime premiaDate) {
        this.premiaDate = premiaDate;
    }

    public Long getId() {
        return this.id;
    }

    public String getPracownik() {
        return this.pracownik;
    }

    public Double getPremia() {
        return this.premia;
    }

    public LocalDateTime getPremiaDate() {
        return this.premiaDate;
    }

    public PersonelPremia() {
    }

    public PersonelPremia(String pracownik, Double premia, LocalDateTime premiaDate) {
        this.pracownik = pracownik;
        this.premia = premia;
        this.premiaDate = premiaDate;
    }
}