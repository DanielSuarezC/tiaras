import pdfMake from "pdfmake/build/pdfmake";
import { variable64 } from "../../../../assets/img";
import { Producto } from "../models/product/entities/Producto";
import { CartService } from "../models/product/services/cart.service";


const generatePDF = (
  products: Producto[],
  fecha: string,
  cartservice: CartService
) => {
  const tableBody = [
    [
      { text: "Nombre producto", style: "tableHeader" },
      { text: "Descripción", style: "tableHeader" },
      { text: "Precio", style: "tableHeader" },
    ],
    ...products.map((product, index) => [
      { image: `image${index}`, width: 100 },
      product.descripcion,
      product.precio,
    ]),
  ];

  const images = products.reduce((acc, product, index) => {
    acc[`image${index}`] = `http://localhost:3000/tiaras/api/uploads/${product.imagenes?.[0]}`;
    return acc;
  }, {});

  const content: any[] = [];

  content.push({
    columns: [
      { image: variable64.miVar, width: 100 },
      {
        stack: [
          {
            text: `Fecha: ${fecha}    |    Síguenos en Instagram`,
            style: "subheader",
            alignment: "right",
          },
          {
            qr: "https://www.instagram.com/tiarascol/",
            fit: 100,
            alignment: "right",
            margin: [0, 10, 0, 10],
          },
        ],
        alignment: "right",
      },
    ],
  });

  content.push({ text: "\n" });

  content.push({
    table: {
      headerRows: 1,
      widths: ["*", "*", "*"],
      body: tableBody,
    },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 10],
  });

  const styles = {
    header: {
      fontSize: 14,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: "black",
      fillColor: "#C69D75"
    },
    total: {
      fontSize: 12,
      bold: true,
    },
  };



  const docDefinition: any = {
    content,
    styles,
    // Configurar fondo de todo el documento
    background: () => {
      return {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 595.28,  // Ancho estándar A4 en puntos (21cm)
            h: 841.89,  // Alto estándar A4 en puntos (29.7cm)
            color: '#FBF6E4'
          }
        ]
      };
    },
    pageMargins: [40, 60, 40, 60],
    images: {
      snow: cartservice.imagenBase64,
    },
  };

  docDefinition.images = { ...docDefinition.images, ...images };

  pdfMake.createPdf(docDefinition).open();
};
export default generatePDF;
