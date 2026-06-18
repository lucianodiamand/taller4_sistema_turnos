package com.taller4.sistematurnos.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Por ahora todo está permitido (permitAll) para que el endpoint /api/health,
 * el Swagger UI y la
 * consola H2 funcionen sin login. En el ciclo de autenticación se reemplazará
 * por una cadena con
 * filtro JWT, roles (ADMIN / PROFESIONAL / CLIENTE) y endpoints protegidos.
 */
@Configuration
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(Customizer.withDefaults())
        .csrf(csrf -> csrf.disable())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        // Necesario para que la consola H2 (que usa frames) se renderice.
        .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
    return http.build();
  }

  /**
   * Permite las llamadas del dev server de Angular (localhost:4200) En desarrollo
   * usamos el proxy
   * de Angular hacia /api, pero dejar CORS configurado evita sorpresas al llamar
   * al backend
   * directamente
   */
  @Bean
  // @Bean es necesario para que Spring lo registre como un bean y lo use en la
  // configuración
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }
}
