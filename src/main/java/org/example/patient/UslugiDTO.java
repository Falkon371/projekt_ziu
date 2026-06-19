package org.example.patient;


public class UslugiDTO {
    private String name;
    private String value;
    private String valueKoszt;
    private String typ;

    public void setName(String name) {
        this.name = name;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setValueKoszt(String valueKoszt) {
        this.valueKoszt = valueKoszt;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public String getName() {
        return this.name;
    }

    public String getValue() {
        return this.value;
    }

    public String getValueKoszt() {
        return this.valueKoszt;
    }

    public String getTyp() {
        return this.typ;
    }

    public UslugiDTO(String name, String value, String valueKoszt, String typ) {
        this.name = name;
        this.value = value;
        this.valueKoszt = valueKoszt;
        this.typ = typ;
    }
}
