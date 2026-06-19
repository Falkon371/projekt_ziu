package org.example.patient.security;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Generated;

@Entity
@Table(name = "securetokens")
public class SecureToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String token;

    @Column(updatable = false)
    @Basic(optional = false)
    private LocalDateTime expiredAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Generated
    public SecureToken() {
    }

    @Generated
    public Long getId() {
        return id;
    }

    @Generated
    public void setId(Long id) {
        this.id = id;
    }

    @Generated
    public String getToken() {
        return token;
    }

    @Generated
    public void setToken(String token) {
        this.token = token;
    }

    @Generated
    public LocalDateTime getExpiredAt() {
        return expiredAt;
    }

    @Generated
    public void setExpiredAt(LocalDateTime expiredAt) {
        this.expiredAt = expiredAt;
    }

    @Generated
    public User getUser() {
        return user;
    }

    @Generated
    public void setUser(User user) {
        this.user = user;
    }

    @Generated
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SecureToken)) return false;

        SecureToken other = (SecureToken) o;
        if (!other.canEqual(this)) return false;

        if (id != null ? !id.equals(other.id) : other.id != null) return false;
        if (token != null ? !token.equals(other.token) : other.token != null) return false;
        if (expiredAt != null ? !expiredAt.equals(other.expiredAt) : other.expiredAt != null) return false;
        return user != null ? user.equals(other.user) : other.user == null;
    }

    @Generated
    protected boolean canEqual(Object other) {
        return other instanceof SecureToken;
    }

    @Generated
    @Override
    public int hashCode() {
        int result = 1;
        result = 59 * result + (id == null ? 43 : id.hashCode());
        result = 59 * result + (token == null ? 43 : token.hashCode());
        result = 59 * result + (expiredAt == null ? 43 : expiredAt.hashCode());
        result = 59 * result + (user == null ? 43 : user.hashCode());
        return result;
    }

    @Generated
    @Override
    public String toString() {
        return "SecureToken(id=" + id +
                ", token=" + token +
                ", expiredAt=" + expiredAt +
                ", user=" + user + ")";
    }
}
