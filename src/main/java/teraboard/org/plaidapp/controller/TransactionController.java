package teraboard.org.plaidapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import teraboard.org.plaidapp.model.transaction;
import teraboard.org.plaidapp.repository.TransactionRepository;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionRepository repository;

    @GetMapping
    public List<transaction> getAllTransactions() {
        return repository.findAll();
    }

    @PostMapping
    public transaction createTransaction(@RequestBody transaction transaction) {
        return repository.save(transaction);
    }
}