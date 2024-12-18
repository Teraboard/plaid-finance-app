package teraboard.org.plaidapp.repository;

import teraboard.org.plaidapp.model.transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<transaction, String> {

}
