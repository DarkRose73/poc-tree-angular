import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface Permiso {
  nombre: string;
  idMenu: number;
}

interface NodoArbol {
  permiso: Permiso;
  hijos: NodoArbol[];
}

@Component({
  selector: 'components-tree',
  templateUrl: './tree.component.html',
  styles: [
    `
      .mat-tree-node {
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class TreeComponent {
  listaJerarquias: string[] = [
    '1',
    '2',
    '3',
    '4',
    '4->5',
    '4->8->10',
    '6',
    '7',
    '9',
    '9->14',
    '9->22',
    '15',
    '22',
    '23',
    '23->45',
    '23->48',
    '55',
    '55->56->57->58',
  ];

  listaPermisos: Permiso[] = [
    { nombre: 'menu1', idMenu: 1 },
    { nombre: 'menu2', idMenu: 2 },
    { nombre: 'menu3', idMenu: 3 },
    { nombre: 'menu4', idMenu: 4 },
    { nombre: 'menu5', idMenu: 5 },
    { nombre: 'menu6', idMenu: 6 },
    { nombre: 'menu7', idMenu: 7 },
    { nombre: 'menu8', idMenu: 8 },
    { nombre: 'menu9', idMenu: 9 },
    { nombre: 'menu10', idMenu: 10 },
    { nombre: 'menu14', idMenu: 14 },
    { nombre: 'menu15', idMenu: 15 },
    { nombre: 'menu22', idMenu: 22 },
    { nombre: 'menu23', idMenu: 23 },
    { nombre: 'menu45', idMenu: 45 },
    { nombre: 'menu48', idMenu: 48 },
    { nombre: 'menu55', idMenu: 55 },
    { nombre: 'menu56', idMenu: 56 },
    { nombre: 'menu57', idMenu: 57 },
    { nombre: 'menu58', idMenu: 58 },
  ];

  private _transformer = (node: NodoArbol, level: number) => {
    return {
      expandable: !!node.hijos && node.hijos.length > 0,
      name: node.permiso.nombre,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  // treeControl = new NestedTreeControl<NodoArbol>((node) => node.hijos);

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.hijos
  );
  // dataSource = new MatTreeNestedDataSource<NodoArbol>();
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    const nodos = this.construirArbol(this.listaJerarquias, this.listaPermisos);
    this.dataSource.data = nodos;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  private construirArbol(
    listaJerarquias: string[],
    listaPermisos: Permiso[]
  ): NodoArbol[] {
    const nodos: NodoArbol[] = [];

    function encontrarNodo(
      idMenu: number,
      nodos: NodoArbol[]
    ): NodoArbol | undefined {
      for (const nodo of nodos) {
        if (nodo.permiso.idMenu === idMenu) {
          return nodo;
        }

        const nodoEncontrado = encontrarNodo(idMenu, nodo.hijos);
        if (nodoEncontrado) {
          return nodoEncontrado;
        }
      }

      return undefined;
    }

    for (const jerarquia of listaJerarquias) {
      const partes = jerarquia.split('->');
      const idMenu = parseInt(partes[partes.length - 1], 10);

      const permiso = listaPermisos.find((p) => p.idMenu === idMenu);
      if (permiso) {
        let nodoPadre: NodoArbol | undefined = undefined;
        for (let i = 0; i < partes.length - 1; i++) {
          const idPadre = parseInt(partes[i], 10);
          if (!isNaN(idPadre)) {
            const nodoExistente = encontrarNodo(idPadre, nodos);
            if (nodoExistente) {
              nodoPadre = nodoExistente;
            } else {
              const permisoPadre = listaPermisos.find(
                (p) => p.idMenu === idPadre
              );
              if (permisoPadre) {
                const nuevoNodo: NodoArbol = {
                  permiso: permisoPadre,
                  hijos: [],
                };
                if (nodoPadre) {
                  nodoPadre.hijos.push(nuevoNodo);
                } else {
                  nodos.push(nuevoNodo);
                }
                nodoPadre = nuevoNodo;
              }
            }
          }
        }

        const nuevoNodo: NodoArbol = {
          permiso,
          hijos: [],
        };

        if (nodoPadre) {
          nodoPadre.hijos.push(nuevoNodo);
        } else {
          nodos.push(nuevoNodo);
        }
      }
    }

    return nodos;
  }

  mostrarArbolConsola(): void {
    let a = this.construirArbol(this.listaJerarquias, this.listaPermisos);
    console.log(a);
  }
}
