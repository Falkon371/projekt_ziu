package org.example.patient.controllers;

import jakarta.transaction.Transactional;
import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.example.patient.*;
import org.example.patient.repo.HistoriaRepo;
import org.example.patient.repo.HistoriaWarunkiPatRepo;
import org.example.patient.services.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        path = {"/patients"}
)
@CrossOrigin(
        origins = {"http://localhost:3000"}
)
public class PatientController {
    private final PatientService patientService;
    @Autowired
    private HistoriaRepo historiaRepo;
    @Autowired
    private HistoriaWarunkiPatRepo historiaWarunkiPatRepo;
    private Map<Set<String>, Double> WarMaps;
    private Map<Set<String>, Double> NewMaps;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping({"/histpremie"})
    public List<Historia> getAllHistPremie() {
        return this.historiaRepo.findAll();
    }

    @GetMapping({"/histWarPremie"})
    public List<HistoriaWarunkiPatients> getAllHistWarPremie() {
        return this.historiaWarunkiPatRepo.findAll();
    }

    @DeleteMapping({"/deleteByTimestamp/{timestamp}"})
    @Transactional
    public ResponseEntity<Void> deleteByTimestamp(@PathVariable String timestamp) {
        LocalDateTime czas;
        try {
            czas = LocalDateTime.parse(timestamp);
        } catch (DateTimeException var4) {
            return ResponseEntity.noContent().build();
        }

        this.historiaRepo.deleteByCzas(czas);
        this.historiaWarunkiPatRepo.deleteByCzas(czas);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<Patient> getPatient(@RequestParam(required = false) String pesel) {
        return pesel != null ? this.patientService.getPatientPesel(pesel) : this.patientService.getPatient();
    }

    @GetMapping({"/{pesel}"})
    public List<Patient> getPatientPesel(@PathVariable String pesel) {
        return this.patientService.getPatientPesel(pesel);
    }

    @PostMapping({"/input"})
    public String receiveFields(@RequestBody List<WarunkiDTO> fields) {
        Map<Set<String>, Double> mapaWarunkow = new HashMap();
        Iterator var3 = fields.iterator();

        while(var3.hasNext()) {
            WarunkiDTO item = (WarunkiDTO)var3.next();
            String[] warunkiArray = item.getName().split(",");
            Set<String> warunkiSet = new HashSet(Arrays.asList(warunkiArray));
            mapaWarunkow.put(warunkiSet, Double.parseDouble(item.getValue()));
        }

        System.out.println(mapaWarunkow);
        this.WarMaps = mapaWarunkow;
        this.patientService.zapiszDane(mapaWarunkow);
        return "Warunki zapisane";
    }

    @PostMapping({"/inputRejestr"})
    public String reveiveData(@RequestBody List<WarunkiDTO> fields) {
        Map<Set<String>, Double> mapaWarunkow = new HashMap();
        Iterator var3 = fields.iterator();

        while(var3.hasNext()) {
            WarunkiDTO item = (WarunkiDTO)var3.next();
            String[] warunkiArray = item.getName().split(",");
            Set<String> warunkiSet = new HashSet(Arrays.asList(warunkiArray));
            mapaWarunkow.put(warunkiSet, Double.parseDouble(item.getValue()));
        }

        System.out.println(mapaWarunkow);
        this.NewMaps = mapaWarunkow;
        this.patientService.drugieZapiszDane(mapaWarunkow);
        return "Warunki zapisane";
    }

    @GetMapping({"/noweDane"})
    public ResponseEntity<Map<Set<String>, Double>> pokazDane() {
        return ResponseEntity.ok(this.patientService.pobierzDane());
    }

    @PostMapping({"/miesiacDane"})
    public ResponseEntity<Integer> ustawMiesiac(@RequestBody Map<String, Integer> payload) {
        Integer numerMiesiaca = (Integer)payload.get("month");
        if (numerMiesiaca != null && numerMiesiaca >= 0 && numerMiesiaca <= 11) {
            int wynik = this.patientService.liczMiesiac(numerMiesiaca);
            return ResponseEntity.ok(wynik);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping({"/miesiacDane"})
    public ResponseEntity<Integer> pobMiesiac() {
        return ResponseEntity.ok(this.patientService.pobMiesiac());
    }

    @GetMapping({"/unikRej"})
    public ResponseEntity<List<String>> unikalneRej() {
        return ResponseEntity.ok(this.patientService.getAllRejestrator());
    }

    @GetMapping({"/final"})
    public ResponseEntity<Map<String, Map<Set<String>, Integer>>> newGetDane() {
        return ResponseEntity.ok(this.patientService.wynikPremii());
    }

    @GetMapping({"/obl"})
    public ResponseEntity<Map<String, List<Set<String>>>> GetDane() {
        return ResponseEntity.ok(this.patientService.mapaRejestrów());
    }
    @GetMapping({"/ikMan"})
    public ResponseEntity<Map<String, Double>> finalWynik() {
        return ResponseEntity.ok(this.patientService.finalWynik());
    }

    @GetMapping({"/wtfMan"})
    public ResponseEntity<Map<String, Long>> liczbaRejestracji() {
        return ResponseEntity.ok(this.patientService.obliczLiczbeRejestracji());
    }

    @PostMapping
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient) {
        Patient createdPatient = this.patientService.addPatient(patient);
        return ResponseEntity.ok(createdPatient);
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        try {
            this.patientService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException var3) {
            return ResponseEntity.notFound().build();
        }
    }
}