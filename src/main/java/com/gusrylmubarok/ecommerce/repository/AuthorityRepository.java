package com.gusrylmubarok.ecommerce.repository;

import com.gusrylmubarok.ecommerce.domain.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
