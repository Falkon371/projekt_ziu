package org.example.patient.security;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String name;
    private String username;
    private String role;

    public boolean accountVerified;
    private int failedLoginAttempts;
    private Instant loginBlockedUntil;

    public String getVerificationToken() {
        return verificationToken;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    private String verificationToken;

    public int getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public Instant getLoginBlockedUntil(){
        return loginBlockedUntil;
    }

    public void setFailedLoginAttempts(int failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public void setLoginBlockedUntil(Instant loginBlockedUntil) {
        this.loginBlockedUntil = loginBlockedUntil;
    }

    @Column(nullable = false)
    private boolean loginDisabled;

    @OneToMany(mappedBy = "user")
    private Set<SecureToken> token;

    public User() {
    }

    public User(Long id, String email, String password, String name, String username, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.username = username;
        this.role = role;
    }

    public User(Long id, String email, String password, String name, String username,
                String role, boolean accountVerified, boolean loginDisabled, int failedLoginAttempts,
                Instant loginBlockedUntil, String verificationToken) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.username = username;
        this.role = role;
        this.accountVerified = accountVerified;
        this.loginDisabled = loginDisabled;
        this.failedLoginAttempts = failedLoginAttempts;
        this.loginBlockedUntil = loginBlockedUntil;
        this.verificationToken = verificationToken;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isAccountVerified() {
        return accountVerified;
    }

    public void setAccountVerified(boolean accountVerified) {
        this.accountVerified = accountVerified;
    }

    public boolean isLoginDisabled() {
        return loginDisabled;
    }

    public void setLoginDisabled(boolean loginDisabled) {
        this.loginDisabled = loginDisabled;
    }

    public Set<SecureToken> getToken() {
        return token;
    }

    public void setToken(Set<SecureToken> token) {
        this.token = token;
    }


    public void accountVerified(boolean b) {
    }
}
