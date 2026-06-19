package org.example.patient;


public class WarunkiDTO {
    private String name;
    private String value;

    public WarunkiDTO() {
    }

    public WarunkiDTO(String name, String value) {
        this.name = name;
        this.value = value;
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

    public String toString() {
        return "Field name: " + this.name + ", value: " + this.value;
    }
}