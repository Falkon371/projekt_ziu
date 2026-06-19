package org.example.patient;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(
        name = "rejuslugi"
)
public class RejUslugi {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    @Column(
            name = "imie_i_nazwisko_pacjenta"
    )
    private String imieINazwiskoPacjenta;
    private LocalDate dataWykonania;
    private String nazwaUslugi;
    private String gabinetWykonujacy;
    private String pracownikWprowadzajacy;
    private String pracownikWykonujacy;

    public String getImieINazwiskoPacjenta() {
        return this.imieINazwiskoPacjenta;
    }

    public void setImieINazwiskoPacjenta(String imieINazwiskoPacjenta) {
        this.imieINazwiskoPacjenta = imieINazwiskoPacjenta;
    }

    public LocalDate getDataWykonania() {
        return this.dataWykonania;
    }

    public void setDataWykonania(LocalDate dataWykonania) {
        this.dataWykonania = dataWykonania;
    }

    public String getNazwaUslugi() {
        return this.nazwaUslugi;
    }

    public void setNazwaUslugi(String nazwaUslugi) {
        this.nazwaUslugi = nazwaUslugi;
    }

    public String getGabinetWykonujacy() {
        return this.gabinetWykonujacy;
    }

    public void setGabinetWykonujacy(String gabinetWykonujacy) {
        this.gabinetWykonujacy = gabinetWykonujacy;
    }

    public String getPracownikWprowadzajacy() {
        return this.pracownikWprowadzajacy;
    }

    public void setPracownikWprowadzajacy(String pracownikWprowadzajacy) {
        this.pracownikWprowadzajacy = pracownikWprowadzajacy;
    }

    public String getPracownikWykonujacy() {
        return this.pracownikWykonujacy;
    }

    public void setPracownikWykonujacy(String pracownikWykonujacy) {
        this.pracownikWykonujacy = pracownikWykonujacy;
    }

    public RejUslugi() {
    }

    public RejUslugi(String imieINazwiskoPacjenta, LocalDate dataWykonania, String nazwaUslugi, String gabinetWykonujacy, String pracownikWprowadzajacy, String pracownikWykonujacy) {
        this.imieINazwiskoPacjenta = imieINazwiskoPacjenta;
        this.dataWykonania = dataWykonania;
        this.nazwaUslugi = nazwaUslugi;
        this.gabinetWykonujacy = gabinetWykonujacy;
        this.pracownikWprowadzajacy = pracownikWprowadzajacy;
        this.pracownikWykonujacy = pracownikWykonujacy;
    }
}
