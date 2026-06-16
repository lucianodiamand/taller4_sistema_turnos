package com.taller4.sistematurnos.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class UsuarioDTO {

	private Long id;
	
	@NotBlank
	private String nombre;
	
	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	private String rol; 
	
	private boolean activo;

}