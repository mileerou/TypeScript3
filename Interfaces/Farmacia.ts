import { Medicamento } from "./Interfaces";
import { BST } from "./BST";

class SistemaFarmacia {
  private inventario = new BST<Medicamento>(
    (a, b) => a.nombre.localeCompare(b.nombre),
    (m)    => m.nombre.toLowerCase()
  );

  private porCategoria = new Map<string, Set<string>>();

  registrar(med: Medicamento): void {
    this.inventario.insert(med);
    if (!this.porCategoria.has(med.categoria)) {
      this.porCategoria.set(med.categoria, new Set());
    }
    this.porCategoria.get(med.categoria)!.add(med.nombre.toLowerCase());
  }

  buscar(nombre: string): void {
    const result = this.inventario.search(nombre.toLowerCase());
    console.log(`\n  Búsqueda: "${nombre}"`);
    console.log(`       Pasos en el BST: ${result.pasos} de ${this.inventario.size} nodos (altura: ${this.inventario.height})`);
    if (result.found) {
      const m = result.node.value;
      console.log(`       Encontrado`);
      console.log(`       ├─ Principio activo : ${m.principioActivo}`);
      console.log(`       ├─ Precio           : Q${m.precio.toFixed(2)}`);
      console.log(`       ├─ Stock            : ${m.stock} unidades`);
      console.log(`       ├─ Categoría        : ${m.categoria}`);
      console.log(`       └─ Receta           : ${m.requiereReceta ? "Sí" : "No"}`);
    } else {
      console.log(`       No existe en el inventario`);
    }
  }

  vender(nombre: string, cantidad: number): void {
    const result = this.inventario.search(nombre.toLowerCase());
    console.log(`\n Venta: ${cantidad}× "${nombre}"`);
    if (!result.found) {
      console.log(` Medicamento no encontrado`);
      return;
    }
    const m = result.node.value;
    if (m.stock < cantidad) {
      console.log(`       Stock insuficiente — disponible: ${m.stock} unidades`);
      return;
    }
    if (m.requiereReceta) {
      console.log(`       Requiere receta médica`);
    }
    m.stock -= cantidad;
    const total = m.precio * cantidad;
    console.log(`       Despacho OK — Total: Q${total.toFixed(2)} | Stock restante: ${m.stock}`);
  }

  darDeBaja(nombre: string): void {
    const ok = this.inventario.remove(nombre.toLowerCase());
    console.log(`\n  Baja: "${nombre}" — ${ok ? "Eliminado del árbol" : "No encontrado"}`);
  }

  listarOrdenado(): void {
    const lista = this.inventario.inorder();
    console.log(`\n  Inventario completo — inorder (alfabético) [${lista.length} productos]`);
    console.log("  " + "─".repeat(70));
    console.log(`  ${"Nombre".padEnd(26)} ${"Activo".padEnd(18)} ${"Precio".padStart(9)}  ${"Stock".padStart(6)}`);
    console.log("  " + "─".repeat(70));
    for (const m of lista) {
      const alerta = m.stock <= 5 ? "  ⚠️" : "";
      console.log(
        `  ${m.nombre.padEnd(26)} ${m.principioActivo.padEnd(18)}` +
        ` ${("Q" + m.precio.toFixed(2)).padStart(9)}  ${String(m.stock).padStart(6)}${alerta}`
      );
    }
    console.log("  " + "─".repeat(70));
  }

  buscarRango(desde: string, hasta: string): void {
    const res = this.inventario.rangeSearch(desde.toLowerCase(), hasta.toLowerCase());
    console.log(`\n  Rango alfabético ["${desde}" … "${hasta}"] — ${res.length} resultados`);
    for (const m of res) {
      console.log(`       • ${m.nombre.padEnd(28)} Q${m.precio.toFixed(2).padStart(7)}  stock: ${m.stock}`);
    }
  }

  stockCritico(umbral = 10): void {
    const criticos = this.inventario.inorder().filter(m => m.stock <= umbral);
    console.log(`\n  Stock crítico (≤${umbral} unidades) — ${criticos.length} medicamentos`);
    for (const m of criticos) {
      console.log(`       • ${m.nombre.padEnd(28)} stock: ${m.stock}  [${m.categoria}]`);
    }
  }

  estadisticas(): void {
    const lista  = this.inventario.inorder();
    const total  = lista.reduce((s, m) => s + m.precio * m.stock, 0);
    const minMed = this.inventario.min();
    const maxMed = this.inventario.max();
    console.log(`\n  Estadísticas del inventario`);
    console.log(`       ├─ Productos en BST       : ${this.inventario.size}`);
    console.log(`       ├─ Altura del árbol        : ${this.inventario.height} niveles`);
    console.log(`       ├─ Valor total inventario  : Q${total.toFixed(2)}`);
    console.log(`       ├─ Primero (A-Z)           : ${minMed?.nombre}`);
    console.log(`       └─ Último  (A-Z)           : ${maxMed?.nombre}`);
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const farmacia = new SistemaFarmacia();

console.log("═".repeat(72));
console.log("  FARMACIA SAN RAFAEL — Sistema de Inventario  (BST en TypeScript)");
console.log("═".repeat(72));

const medicamentos: Medicamento[] = [
  { nombre: "Amoxicilina 500mg",  principioActivo: "Amoxicilina",    precio: 45.00, stock: 80,  categoria: "antibiotico",      requiereReceta: true  },
  { nombre: "Paracetamol 500mg",  principioActivo: "Paracetamol",    precio: 12.50, stock: 200, categoria: "analgesico",       requiereReceta: false },
  { nombre: "Ibuprofeno 400mg",   principioActivo: "Ibuprofeno",     precio: 18.75, stock: 150, categoria: "analgesico",       requiereReceta: false },
  { nombre: "Losartán 50mg",      principioActivo: "Losartán",       precio: 55.00, stock: 60,  categoria: "antihipertensivo", requiereReceta: true  },
  { nombre: "Enalapril 10mg",     principioActivo: "Enalapril",      precio: 38.00, stock: 45,  categoria: "antihipertensivo", requiereReceta: true  },
  { nombre: "Vitamina C 1000mg",  principioActivo: "Ác. ascórbico",  precio: 22.00, stock: 120, categoria: "vitamina",         requiereReceta: false },
  { nombre: "Vitamina D3 1000UI", principioActivo: "Colecalciferol", precio: 30.00, stock: 8,   categoria: "vitamina",         requiereReceta: false },
  { nombre: "Azitromicina 500mg", principioActivo: "Azitromicina",   precio: 85.00, stock: 30,  categoria: "antibiotico",      requiereReceta: true  },
  { nombre: "Metformina 850mg",   principioActivo: "Metformina",     precio: 28.00, stock: 5,   categoria: "otro",             requiereReceta: true  },
  { nombre: "Omeprazol 20mg",     principioActivo: "Omeprazol",      precio: 35.00, stock: 90,  categoria: "otro",             requiereReceta: false },
  { nombre: "Clonazepam 0.5mg",   principioActivo: "Clonazepam",     precio: 42.00, stock: 3,   categoria: "otro",             requiereReceta: true  },
  { nombre: "Cetirizina 10mg",    principioActivo: "Cetirizina",     precio: 15.00, stock: 110, categoria: "otro",             requiereReceta: false },
];

console.log(`\n  Registrando ${medicamentos.length} medicamentos en el BST...`);
medicamentos.forEach(m => farmacia.registrar(m));

farmacia.listarOrdenado();
farmacia.buscar("Paracetamol 500mg");
farmacia.buscar("Azitromicina 500mg");
farmacia.buscar("Aspirina 100mg");
farmacia.vender("Ibuprofeno 400mg", 3);
farmacia.vender("Clonazepam 0.5mg", 5);
farmacia.vender("Losartán 50mg", 2);
farmacia.buscarRango("C", "M");
farmacia.stockCritico(10);
farmacia.darDeBaja("Vitamina D3 1000UI");
farmacia.estadisticas();

console.log("\n" + "═".repeat(72));