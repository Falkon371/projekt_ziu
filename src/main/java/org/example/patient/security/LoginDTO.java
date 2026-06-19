package org.example.patient.security;

import lombok.Generated;

public class LoginDTO {
    private String email;
    private String password;

    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Generated
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LoginDTO)) return false;

        LoginDTO other = (LoginDTO) o;
        if (!other.canEqual(this)) return false;

        if (email != null ? !email.equals(other.email) : other.email != null) return false;
        return password != null ? password.equals(other.password) : other.password == null;
    }

    @Generated
    protected boolean canEqual(Object other) {
        return other instanceof LoginDTO;
    }

    @Generated
    @Override
    public int hashCode() {
        int result = 1;
        result = 59 * result + (email == null ? 43 : email.hashCode());
        result = 59 * result + (password == null ? 43 : password.hashCode());
        return result;
    }

    @Generated
    @Override
    public String toString() {
        return "LoginDTO(email=" + email + ", password=" + password + ")";
    }
}
