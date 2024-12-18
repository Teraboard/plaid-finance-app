package teraboard.org.plaidapp.controller;
import teraboard.org.plaidapp.model.transaction;
import teraboard.org.plaidapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository repository;

    @GetMapping
    public List<transaction> getAllTransactions() {
        return repository.findAll();
    }
    @PostMapping
    public transaction addTransaction(@RequestBody transaction transaction) {
        return repository.save(transaction);
    }
}

