package teraboard.org.plaidapp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import teraboard.org.plaidapp.model.Transaction;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

}
