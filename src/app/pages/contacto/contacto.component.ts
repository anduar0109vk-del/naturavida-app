import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="contacto-page">
      <section class="hero-contacto">
        <h1>Contáctanos</h1>
        <p>Estamos aquí para ayudarte</p>
      </section>
      <div class="contacto-grid">
        <div class="contact-card">
          <h3>WhatsApp</h3>
          <p>+51 929 877 999</p>
          <a href="https://wa.me/51929877999" class="btn-contact">Escribir ahora</a>
        </div>
        <div class="contact-card">
          <h3>Correo</h3>
          <p>hola&#64;naturavida.com</p>
          <a href="mailto:hola@naturavida.com" class="btn-contact">Enviar email</a>
        </div>
        <div class="contact-card">
          <h3>Ubicación</h3>
          <p>Lima, Perú</p>
          <a routerLink="/nosotros" class="btn-contact">Sobre nosotros</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contacto-page { min-height: 100vh; }
    .hero-contacto { padding: 8rem 2rem 4rem; text-align: center; background: linear-gradient(135deg, #f0faf4, #fefae0); }
    .hero-contacto h1 { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #1a3d2b; margin-bottom: 0.5rem; }
    .hero-contacto p { color: #6b8f7a; }
    .contacto-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 900px; margin: 0 auto; padding: 4rem 1.5rem; }
    .contact-card { text-align: center; background: white; border-radius: 20px; padding: 2.5rem; border: 1px solid rgba(45,106,79,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .contact-card:hover { transform: translateY(-4px); }
    .contact-card span { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .contact-card h3 { font-size: 1.1rem; font-weight: 600; color: #1a3d2b; margin-bottom: 0.4rem; }
    .contact-card p { color: #888; margin-bottom: 1.25rem; font-size: 0.9rem; }
    .btn-contact { display: inline-block; padding: 0.6rem 1.5rem; background: var(--color-primary); color: white; border-radius: 10px; text-decoration: none; font-size: 0.88rem; font-weight: 500; transition: background 0.2s; }
    .btn-contact:hover { background: var(--color-primary-dark); }
    @media (max-width: 640px) { .contacto-grid { grid-template-columns: 1fr; } }
  `]
})
export class ContactoComponent {}
