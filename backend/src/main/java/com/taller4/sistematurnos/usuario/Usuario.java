package com.taller4.sistematurnos.usuario;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String nombre;

	@Column(nullable = false, unique = true, length = 100)
	private String email;

	@Column(name = "contrascena_hash", nullable = false, length = 255)
	private String contraseñaHash;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private ERole rol;

	@Column(nullable = false)
	private boolean activo = true;

}