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
        name = "historiaWarunkiPracownik"
)
public class HistoriaWarunkiPracownik {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private long id;
    private String name;
    private String value;
    private String valueKoszt;
    private String typ;
    @Column(
            columnDefinition = "TIMESTAMP"
    )
    private LocalDateTime czas;

    public LocalDateTime getCzas() {
        return this.czas;
    }

    public void setCzas(LocalDateTime czas) {
        this.czas = czas;
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

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getValueKoszt() {
        return this.valueKoszt;
    }

    public void setValueKoszt(String valueKoszt) {
        this.valueKoszt = valueKoszt;
    }

    public String getTyp() {
        return this.typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public HistoriaWarunkiPracownik(long id, String name, String value, String valueKoszt, String typ, LocalDateTime czas) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.valueKoszt = valueKoszt;
        this.typ = typ;
        this.czas = czas;
    }

    public HistoriaWarunkiPracownik() {
    }
}
