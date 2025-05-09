package teraboard.org.plaidapp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import teraboard.org.plaidapp.model.PlaidItem;

import java.util.List;
import java.util.Optional;

public interface PlaidItemRepository extends MongoRepository<PlaidItem, String> {
    Optional<PlaidItem> findByPlaidItemId(String plaidItemId);
    List<PlaidItem> findByUserId(String userId);
}