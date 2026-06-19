package org.example.patient.security;

import org.example.patient.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VerificationTokenService {

    @Autowired
    private UserRepo userRepo;

    public void createVerificationToken(User user, String token) {
        user.setVerificationToken(token);
        userRepo.save(user);
    }

    public String validateVerificationToken(String token) {
        User user = userRepo.findByVerificationToken(token).orElse(null);
        if (user == null) {
            return "invalid";
        }

        user.accountVerified(true);
        userRepo.save(user);
        return "valid";
    }



}
