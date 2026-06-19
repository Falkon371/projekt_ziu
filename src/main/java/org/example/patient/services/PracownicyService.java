package org.example.patient.services;

import org.example.patient.HistoriaPrac;
import org.example.patient.HistoriaWarunkiPracownik;
import org.example.patient.RejUslugi;
import org.example.patient.UslugiDTO;
import org.example.patient.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class PracownicyService {

    private final PracownikRepo pracownikRepo;
    private final PersonelPremiaRepo personelPremiaRepo;
    private final HistoriaPracRepo historiaPracRepo;
    private final HistoriaWarunkiPracRepo historiaWarunkiPracRepo;
    private final RejUslugiRepo rejUslugiRepo;

    private int miesiac;
    private List<UslugiDTO> ostatnieDane;

    @Autowired
    public PracownicyService(PracownikRepo pracownikRepo,
                             PersonelPremiaRepo personelPremiaRepo,
                             HistoriaWarunkiPracRepo historiaWarunkiPracRepo,
                             HistoriaPracRepo historiaPracRepo,
                             RejUslugiRepo rejUslugiRepo) {
        this.pracownikRepo = pracownikRepo;
        this.personelPremiaRepo = personelPremiaRepo;
        this.historiaPracRepo = historiaPracRepo;
        this.historiaWarunkiPracRepo = historiaWarunkiPracRepo;
        this.rejUslugiRepo = rejUslugiRepo;
    }

    public int pobMiesiac() {
        return miesiac;
    }

    public int liczMiesiac(int numMiesiaca) {
        this.miesiac = numMiesiaca;
        return this.miesiac;
    }

    public List<RejUslugi> getPracownicyAll() {
        return rejUslugiRepo.findAll();
    }

    public void zapiszDane(List<UslugiDTO> uslugi) {
        this.ostatnieDane = uslugi;
        for (UslugiDTO u : uslugi) {
            System.out.println("Zapisuję: " + u.getName() + ", koszt: " + u.getValueKoszt());
        }
    }

    public List<UslugiDTO> pobierzDane() {
        return ostatnieDane != null ? ostatnieDane : new ArrayList<>();
    }

    public List<String> getAllRejestrator() {
        return rejUslugiRepo.findAll().stream()
                .flatMap(pracownik -> Stream.of(
                        pracownik.getPracownikWprowadzajacy(),
                        pracownik.getPracownikWykonujacy()))
                .filter(Objects::nonNull)
                .filter(value -> !value.equals(". ."))
                .distinct()
                .collect(Collectors.toList());
    }

    public Map<String, Double> allPersonelPremie() {
        List<UslugiDTO> warunkiMap = pobierzDane();
        Map<String, Double> personelPremieMap = new HashMap<>();
        int miesiacDoPorownania = this.miesiac + 1;

        for (RejUslugi item : getPracownicyAll()) {
            String nazwaUslugi = item.getNazwaUslugi();
            UslugiDTO pasujacaUsluga = warunkiMap.stream()
                    .filter(u -> u.getName().equalsIgnoreCase(nazwaUslugi))
                    .findFirst()
                    .orElse(null);

            if (pasujacaUsluga == null) continue;

            LocalDate data = item.getDataWykonania();
            if (data.getMonthValue() != miesiacDoPorownania) continue;

            String pracownik = "A".equalsIgnoreCase(pasujacaUsluga.getTyp())
                    ? item.getPracownikWprowadzajacy()
                    : item.getPracownikWykonujacy();

            if (pracownik == null || pracownik.trim().isEmpty() || pracownik.trim().equals(".") || pracownik.trim().equals(". .")) {
                continue;
            }

            try {
                double koszt = Double.parseDouble(Optional.ofNullable(pasujacaUsluga.getValueKoszt()).orElse("0").replace(",", "."));
                double procent = Double.parseDouble(Optional.ofNullable(pasujacaUsluga.getValue()).orElse("0").replace(",", "."));
                double premia = procent == 0.0 ? koszt : koszt * (procent / 100.0);

                personelPremieMap.merge(pracownik, premia, Double::sum);

            } catch (NumberFormatException e) {
                System.err.println("Błąd parsowania wartości liczbowej dla usługi: " + pasujacaUsluga.getName());
                e.printStackTrace();
            }
        }

        saveToTable(personelPremieMap);
        return personelPremieMap;
    }

    public void saveToTable(Map<String, Double> premieRej) {
        List<UslugiDTO> warunkiMap = pobierzDane();
        LocalDateTime now = LocalDateTime.now();

        for (Map.Entry<String, Double> entry : premieRej.entrySet()) {
            HistoriaPrac historia = new HistoriaPrac();
            historia.setImie(entry.getKey());
            historia.setPremia(entry.getValue());
            historia.setCzas(now);
            historiaPracRepo.save(historia);
        }

        for (UslugiDTO dto : warunkiMap) {
            HistoriaWarunkiPracownik warunek = new HistoriaWarunkiPracownik();
            warunek.setName(dto.getName());
            warunek.setValue(dto.getValue());
            warunek.setValueKoszt(dto.getValueKoszt());
            warunek.setTyp(dto.getTyp());
            warunek.setCzas(now);
            historiaWarunkiPracRepo.save(warunek);
        }
    }
}