package org.example.patient.services;

import org.example.patient.Historia;
import org.example.patient.HistoriaWarunkiPatients;
import org.example.patient.Patient;
import org.example.patient.repo.HistoriaRepo;
import org.example.patient.repo.HistoriaWarunkiPatRepo;
import org.example.patient.repo.PatientRepo;
import org.example.patient.repo.PersonelPremiaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.example.patient.UslugiDTO;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class PatientService {

    private final PatientRepo patientRepo;
    private final PersonelPremiaRepo personelPremiaRepo;
    private final HistoriaRepo historiaRepo;
    private final HistoriaWarunkiPatRepo historiaWarunkiPatRepo;

    private int miesiac;
    private Map<Set<String>, Double> ostatnieDane;
    private Map<Set<String>, Double> daneRejestratora;

    @Autowired
    public PatientService(
            PatientRepo patientRepo,
            PersonelPremiaRepo personelPremiaRepo,
            HistoriaRepo historiaRepo,
            HistoriaWarunkiPatRepo historiaWarunkiPatRepo
    ) {
        this.patientRepo = patientRepo;
        this.personelPremiaRepo = personelPremiaRepo;
        this.historiaRepo = historiaRepo;
        this.historiaWarunkiPatRepo = historiaWarunkiPatRepo;
    }

    public Integer pobMiesiac() {
        return miesiac;
    }

    public int liczMiesiac(int numMiesiaca) {
        return miesiac = numMiesiaca;
    }

    public void zapiszDane(Map<Set<String>, Double> dane) {
        this.ostatnieDane = dane;
    }

    public void drugieZapiszDane(Map<Set<String>, Double> dane) {
        this.daneRejestratora = dane;
    }

    public Map<Set<String>, Double> drugiePobierzDane() {
        return daneRejestratora;
    }

    public Map<Set<String>, Double> pobierzDane() {
        return ostatnieDane;
    }

    public List<Patient> getPatient() {
        return patientRepo.findAll();
    }

    public List<Patient> getPatientPesel(String pesel) {
        return patientRepo.findAll().stream()
                .filter(patient -> pesel.equals(patient.getPesel()))
                .collect(Collectors.toList());
    }

    public List<String> getDeclarationByPesel(String pesel) {
        return patientRepo.findAll().stream()
                .filter(p -> pesel.equals(p.getPesel()))
                .map(Patient::getTypDeklaracji)
                .collect(Collectors.toList());
    }

    public List<String> getAllRejestrator() {
        return patientRepo.findAll().stream()
                .map(Patient::getPersonelRejestracji)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public Map<String, Double> finalWynik() {
        Map<String, Double> premieByPersonel = new HashMap<>();
        Map<String, Map<Set<String>, Integer>> countMap = wynikPremii();
        Map<Set<String>, Double> warunkiMap = drugiePobierzDane();

        for (Map.Entry<String, Map<Set<String>, Integer>> entry : countMap.entrySet()) {
            String rejestrator = entry.getKey();
            double totalSum = 0.0; // ← PRZENIESIONE TUTAJ

            for (Map.Entry<Set<String>, Integer> out : entry.getValue().entrySet()) {
                Set<String> key = out.getKey();
                Integer value1 = out.getValue();
                Double value2 = warunkiMap.get(key);

                if (value2 != null) {
                    totalSum += value1 * value2;
                }
            }

            premieByPersonel.put(rejestrator, totalSum);
        }
        saveToTable(premieByPersonel);
        return premieByPersonel;
    }

    public Map<String, Map<Set<String>, Integer>> wynikPremii() {
        Map<Set<String>, Double> warunkiMap = drugiePobierzDane();
        Map<String, List<Set<String>>> mapRej = mapaRejestrów();
        Map<String, Map<Set<String>, Integer>> mapCount = new HashMap<>();



        for (Map.Entry<String, List<Set<String>>> rejDek : mapRej.entrySet()) {
            String rejestrator = rejDek.getKey();
            List<Set<String>> deklaracje = rejDek.getValue();
            Map<Set<String>, Integer> countMap = new HashMap<>();

            for (Set<String> warKey : warunkiMap.keySet()) {
                countMap.put(warKey, 0);
            }


            for (Set<String> dek : deklaracje) {
                for (Set<String> warKey : warunkiMap.keySet()) {
                    if (dek.equals(warKey)) {
                        countMap.put(warKey, countMap.get(warKey) + 1);
                    }
                }

            }

            for (Map.Entry<Set<String>, Integer> entry : countMap.entrySet()) {
                System.out.println(entry.getKey() + " => " + entry.getValue());
            }

            mapCount.put(rejestrator, countMap);
        }

        return mapCount;
    }

    public Map<String, List<Set<String>>> mapaRejestrów() {
        int miesiac = pobMiesiac() + 1;

        List<Patient> patients = patientRepo.findAll().stream()
                .filter(p -> p.getDataZlozenia().getMonthValue() == miesiac)
                .collect(Collectors.toList());

        Map<String, List<Patient>> rejPatients = patients.stream()
                .collect(Collectors.groupingBy(Patient::getPersonelRejestracji));

        Map<String, List<Set<String>>> deklaracjeByRej = new HashMap<>();

        for (Map.Entry<String, List<Patient>> rej : rejPatients.entrySet()) {
            String rejestrator = rej.getKey();
            List<Patient> pat = rej.getValue();

            // grupowanie pesel -> typy deklaracji
            Map<String, Set<String>> peselToDeklaracje = pat.stream()
                    .collect(Collectors.groupingBy(
                            Patient::getPesel,
                            Collectors.mapping(Patient::getTypDeklaracji, Collectors.toSet())
                    ));

            List<Set<String>> getDeklaracje = new ArrayList<>(peselToDeklaracje.values());

            deklaracjeByRej.put(rejestrator, getDeklaracje);
        }

        return deklaracjeByRej;
    }


    public double obliczPremie() {
        double sumaPremii = 0.0;

        return sumaPremii;
    }


    public void saveToTable(Map<String, Double> premieRej) {
        LocalDateTime now = LocalDateTime.now();

        premieRej.forEach((personel, premia) -> {
            Historia historia = new Historia();
            historia.setName(personel);
            historia.setPremia(premia);
            historia.setCzas(now);
            historiaRepo.save(historia);
        });

        drugiePobierzDane().forEach((warunki, wartosc) -> {
            String warunekString = String.join(",", warunki);
            System.out.println("Zapis warunku: " + warunekString + " = " + wartosc);

            HistoriaWarunkiPatients historiaWarunki = new HistoriaWarunkiPatients();
            historiaWarunki.setWarunek(warunekString);
            historiaWarunki.setWartosc(wartosc);
            historiaWarunki.setCzas(now);

            HistoriaWarunkiPatients saved = historiaWarunkiPatRepo.save(historiaWarunki);
            System.out.println("Zapisano obiekt z ID: " + saved.getId());
        });
    }

    public Map<String, Long> obliczLiczbeRejestracji() {
        Map<Set<String>, Double> warunkiMap = drugiePobierzDane();
        int miesiacTarget = pobMiesiac() + 1;

        Map<String, List<Patient>> groupPesel = patientRepo.findAll().stream()
                .filter(p -> p.getPesel() != null && p.getDataZlozenia() != null &&
                        p.getDataZlozenia().getMonthValue() == miesiacTarget)
                .collect(Collectors.groupingBy(Patient::getPesel));

        Map<String, Long> liczRej = new HashMap<>();

        for (List<Patient> pacjenci : groupPesel.values()) {
            Set<String> typDek = pacjenci.stream()
                    .map(Patient::getTypDeklaracji)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            boolean pasuje = warunkiMap.keySet().stream()
                    .anyMatch(komb -> typDek.containsAll(komb));

            if (pasuje) {
                Set<String> rejestratorzy = pacjenci.stream()
                        .map(Patient::getPersonelRejestracji)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                for (String rejestrator : rejestratorzy) {
                    liczRej.merge(rejestrator, 1L, Long::sum);
                }
            }
        }

        return liczRej;
    }

    public Patient addPatient(Patient patient) {
        return patientRepo.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepo.deleteById(id);
    }
}