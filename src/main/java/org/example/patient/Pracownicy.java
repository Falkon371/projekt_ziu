package org.example.patient;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(
        name = "rezerwacje_uslug"
)
public class Pracownicy {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    private String imieINazwiskoPacjenta;
    private String ulica;
    private String miasto;
    private String pesel;
    private LocalDate dataRezerwacji;
    private LocalDate dataWykonania;
    private String nazwaUslugi;
    private String gabinetWykonujacy;
    private String pracownikWprowadzajacy;
    private String pracownikWykonujacy;

    public Pracownicy() {
    }

    public Pracownicy(long id, String imieINazwiskoPacjenta, String ulica, String miasto, String pesel, LocalDate dataRezerwacji, LocalDate dataWykonania, String nazwaUslugi, String gabinetWykonujacy, String pracownikWprowadzajacy, String pracownikWykonujacy) {
        this.id = id;
        this.imieINazwiskoPacjenta = imieINazwiskoPacjenta;
        this.ulica = ulica;
        this.miasto = miasto;
        this.pesel = pesel;
        this.dataRezerwacji = dataRezerwacji;
        this.dataWykonania = dataWykonania;
        this.nazwaUslugi = nazwaUslugi;
        this.gabinetWykonujacy = gabinetWykonujacy;
        this.pracownikWprowadzajacy = pracownikWprowadzajacy;
        this.pracownikWykonujacy = pracownikWykonujacy;
    }

    public long getId() {
        return this.id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getImieINazwiskoPacjenta() {
        return this.imieINazwiskoPacjenta;
    }

    public void setImieINazwiskoPacjenta(String imieINazwiskoPacjenta) {
        this.imieINazwiskoPacjenta = imieINazwiskoPacjenta;
    }

    public String getUlica() {
        return this.ulica;
    }

    public void setUlica(String ulica) {
        this.ulica = ulica;
    }

    public String getMiasto() {
        return this.miasto;
    }

    public void setMiasto(String miasto) {
        this.miasto = miasto;
    }

    public String getPesel() {
        return this.pesel;
    }

    public void setPesel(String pesel) {
        this.pesel = pesel;
    }

    public LocalDate getDataRezerwacji() {
        return this.dataRezerwacji;
    }

    public void setDataRezerwacji(LocalDate dataRezerwacji) {
        this.dataRezerwacji = dataRezerwacji;
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
}