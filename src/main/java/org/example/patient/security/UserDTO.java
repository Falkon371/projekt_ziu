package org.example.patient.security;

import lombok.Generated;

import java.util.Objects;

public class UserDTO {
    private Long id;
    private String email;
    private String password;
    private String name;
    private String userName;
    private String role;

    public UserDTO() {
    }

    public UserDTO(String email, String password, String name, String userName, String role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.userName = userName;
        this.role = role;
    }

    public UserDTO(Long id, String email, String password, String name, String userName, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.userName = userName;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Generated
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserDTO)) return false;

        UserDTO other = (UserDTO) o;
        if (!other.canEqual(this)) return false;

        return Objects.equals(id, other.id) &&
                Objects.equals(email, other.email) &&
                Objects.equals(password, other.password) &&
                Objects.equals(name, other.name) &&
                Objects.equals(userName, other.userName) &&
                Objects.equals(role, other.role);
    }

    @Generated
    protected boolean canEqual(Object other) {
        return other instanceof UserDTO;
    }

    @Generated
    @Override
    public int hashCode() {
        return Objects.hash(id, email, password, name, userName, role);
    }

    @Generated
    @Override
    public String toString() {
        return "UserDTO(" +
                "email=" + email +
                ", id=" + id +
                ", password=" + password +
                ", name=" + name +
                ", userName=" + userName +
                ", role=" + role +
                ")";
    }
}
