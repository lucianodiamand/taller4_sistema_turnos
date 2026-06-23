package com.taller4.sistematurnos.exception;

import com.taller4.sistematurnos.dto.ErrorDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Traduce las excepciones de la app a respuestas con un formato uniforme. */
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(RecursoNoEncontradoException.class)
  public ResponseEntity<ErrorDTO> handleNoEncontrado(
      RecursoNoEncontradoException ex, HttpServletRequest req) {
    return build(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
  }

  /** Validación de @Valid sobre el body (DTO de entrada). */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorDTO> handleValidacion(
      MethodArgumentNotValidException ex, HttpServletRequest req) {
    Map<String, String> errores = new HashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(fe -> errores.put(fe.getField(), fe.getDefaultMessage()));
    return build(HttpStatus.BAD_REQUEST, "Error de validación", req, errores);
  }

  /** Validación sobre parámetros (@RequestParam / @PathVariable). */
  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ErrorDTO> handleConstraint(
      ConstraintViolationException ex, HttpServletRequest req) {
    return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
  }

  /** Violación de integridad en BD (ej. email duplicado). */
  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorDTO> handleIntegridad(
      DataIntegrityViolationException ex, HttpServletRequest req) {
    return build(HttpStatus.CONFLICT, "Conflicto con el estado actual del recurso", req, null);
  }

  /** Cualquier otra excepción no contemplada. */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorDTO> handleGenerico(Exception ex, HttpServletRequest req) {
    return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", req, null);
  }

  private ResponseEntity<ErrorDTO> build(
      HttpStatus status,
      String message,
      HttpServletRequest req,
      Map<String, String> validationErrors) {
    ErrorDTO body =
        new ErrorDTO(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            req.getRequestURI(),
            validationErrors);
    return ResponseEntity.status(status).body(body);
  }
}
