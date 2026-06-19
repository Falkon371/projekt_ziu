package org.example.patient;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(
        name = "newtable"
)
public class Patient {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    private String imieNazwiskoPacjenta;
    private String ulica;
    private String miasto;
    private String pesel;
    private LocalDate dataUrodzenia;
    private LocalDate dataZlozenia;
    private String typDeklaracji;
    private String plec;
    private String personel;
    private String podmiot;
    private String poradnia;
    private String personelRejestracji;

    public Patient() {
    }

    public Patient(long id, String imieNazwiskoPacjenta, String ulica, String miasto, String imie, String nazwisko, String cos, String gmina, String powiat, String wojewodztwo, String pesel, LocalDate dataUrodzenia, LocalDate dataZlozenia, String cos2, String cos3, String kodPocztowy, String cos3b, String telefon, String email, String status, String typDeklaracji, String cos4, String cos5, String plec, String numerOsrodka, String personel, String cos6, String podmiot, String cos7, String cos8, String cos9, String cos10, String cos11, String cos12, String cos13, String cos14, String cos15, String cos16, String cos17, String cos18, String nrKartoteki, String poradnia, String cos18b, String cos19, String cos20, String cos21, String kraj, String cos22, String cos23, String personelRejestracji) {
        this.id = id;
        this.imieNazwiskoPacjenta = imieNazwiskoPacjenta;
        this.ulica = ulica;
        this.miasto = miasto;
        this.pesel = pesel;
        this.dataUrodzenia = dataUrodzenia;
        this.dataZlozenia = dataZlozenia;
        this.typDeklaracji = typDeklaracji;
        this.plec = plec;
        this.personel = personel;
        this.podmiot = podmiot;
        this.poradnia = poradnia;
        this.personelRejestracji = personelRejestracji;
    }

    public long getId() {
        return this.id;
    }

    public String getImieNazwiskoPacjenta() {
        return this.imieNazwiskoPacjenta;
    }

    public String getUlica() {
        return this.ulica;
    }

    public String getMiasto() {
        return this.miasto;
    }

    public String getPesel() {
        return this.pesel;
    }

    public LocalDate getDataUrodzenia() {
        return this.dataUrodzenia;
    }

    public LocalDate getDataZlozenia() {
        return this.dataZlozenia;
    }

    public String getTypDeklaracji() {
        return this.typDeklaracji;
    }

    public String getPlec() {
        return this.plec;
    }

    public String getPersonel() {
        return this.personel;
    }

    public String getPodmiot() {
        return this.podmiot;
    }

    public String getPoradnia() {
        return this.poradnia;
    }

    public String getPersonelRejestracji() {
        return this.personelRejestracji;
    }
}
