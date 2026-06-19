package org.example.patient.controllers;

import jakarta.transaction.Transactional;
import org.example.patient.HistoriaPrac;
import org.example.patient.HistoriaWarunkiPracownik;
import org.example.patient.RejUslugi;
import org.example.patient.UslugiDTO;
import org.example.patient.repo.HistoriaPracRepo;
import org.example.patient.repo.HistoriaWarunkiPracRepo;
import org.example.patient.services.PracownicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pracownicy")
@CrossOrigin(origins = "http://localhost:3000")
public class PracownicyController {

    private final PracownicyService pracownicyService;
    private final HistoriaWarunkiPracRepo historiaWarunkiPracRepo;
    private final HistoriaPracRepo historiaPracRepo;

    @Autowired
    public PracownicyController(PracownicyService pracownicyService,
                                HistoriaWarunkiPracRepo historiaWarunkiPracRepo,
                                HistoriaPracRepo historiaPracRepo) {
        this.pracownicyService = pracownicyService;
        this.historiaWarunkiPracRepo = historiaWarunkiPracRepo;
        this.historiaPracRepo = historiaPracRepo;
    }

    @GetMapping("/histpremie")
    public List<HistoriaPrac> getAllHistPremie() {
        return historiaPracRepo.findAll();
    }

    @GetMapping("/histWarPremie")
    public List<HistoriaWarunkiPracownik> getAllHistWarPremie() {
        return historiaWarunkiPracRepo.findAll();
    }

    @DeleteMapping("/deleteByTimestamp/{timestamp}")
    @Transactional
    public ResponseEntity<Void> deleteByTimestamp(@PathVariable String timestamp) {
        try {
            LocalDateTime czas = LocalDateTime.parse(timestamp);
            historiaPracRepo.deleteByCzas(czas);
            historiaWarunkiPracRepo.deleteByCzas(czas);
            return ResponseEntity.noContent().build();
        } catch (DateTimeException e) {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/all")
    public List<RejUslugi> getPracownicyAll() {
        return pracownicyService.getPracownicyAll();
    }

    @PostMapping("/input")
    public String receiveFields(@RequestBody List<UslugiDTO> fields) {
        pracownicyService.zapiszDane(fields);
        for (UslugiDTO item : fields) {
            System.out.println("Name: " + item.getName());
            System.out.println("Value: " + item.getValue());
            System.out.println("Koszt: " + item.getValueKoszt());
            System.out.println("Typ: " + item.getTyp());
            System.out.println("---");
        }
        return "Warunki zapisane";
    }

    @GetMapping("/unikRej")
    public ResponseEntity<List<String>> unikalneRej() {
        return ResponseEntity.ok(pracownicyService.getAllRejestrator());
    }

    @GetMapping("/idkMan")
    public ResponseEntity<Map<String, Double>> getDane() {
        return ResponseEntity.ok(pracownicyService.allPersonelPremie());
    }

    @PostMapping("/miesiacDane")
    public ResponseEntity<Integer> ustawMiesiac(@RequestBody Map<String, Integer> payload) {
        Integer numerMiesiaca = payload.get("month");
        if (numerMiesiaca != null && numerMiesiaca >= 0 && numerMiesiaca <= 11) {
            int wynik = pracownicyService.liczMiesiac(numerMiesiaca);
            return ResponseEntity.ok(wynik);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/miesiacDane")
    public ResponseEntity<Integer> pobMiesiac() {
        return ResponseEntity.ok(pracownicyService.pobMiesiac());
    }
}