"use client";
import { useState, useEffect } from "react";
import { database } from "../../../../services/firebase";
import { ref as dbRef, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { Input } from "@/components/ui/input";
import Box from "@/components/ui/box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LucidePencil, LucideTrash } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/components/ProductCard";
import { getProducts, updateProduct, deleteProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImage, setProductImage] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>();
  const [publicId, setPublicId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const router = useRouter();

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setProductImage(product.imageUrl);
    setCategory(product.category || "Outros");
    setDiscount(product.discount || 0);
    router.refresh();
  };

  const handleDelete = (productId: string) => {
    setIsAlertOpen(true);
    setProductToDelete(productId);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        setProducts((prevProducts) =>
          prevProducts?.filter((product) => product.id !== productToDelete)
        );
        alert("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o produto:", error);
        alert("Erro ao excluir o produto!");
      } finally {
        setIsAlertOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price) {
      alert("Preencha todos os campos!");
      return;
    }

    setUploading(true);
    const productId = selectedProduct ? selectedProduct.id : uuidv4();
    try {
      const imageUrl = publicId ? cld.image(publicId).toURL() : "";

      if (selectedProduct) {
        await updateProduct(productId, name, description, price, imageUrl ? imageUrl : productImage,discount, category);
        alert("✅ Produto atualizado com sucesso!");
      } else {
        await set(dbRef(database, `products/${productId}`), {
          name,
          description,
          price,
          imageUrl: imageUrl ? imageUrl : "",
          category,
          discount: discount ? discount : 0,
        });
        alert("✅ Produto adicionado com sucesso!");
      }

      setName("");
      setDescription("");
      setPrice(0);
      setSelectedProduct(null);
    } catch (error) {
      console.error("❌ Erro ao salvar o produto:", error);
      alert("Erro ao salvar o produto!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black p-6">
      <div className="flex flex-col sm:flex-row justify-center gap-8">
        {/* Formulário */}
        <Box>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <h2 className="text-3xl font-extrabold text-center text-white">
              {selectedProduct ? "Editar Produto" : "Adicionar Produto"}
            </h2>

            <div className="flex flex-col">
              <label htmlFor="productName" className="text-white font-semibold mb-1">
                Nome do Produto
              </label>
              <Input
                name="productName"
                type="text"
                placeholder="Nome do produto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="text-white font-semibold mb-1">
                Categoria
              </label>
              <Input
                name="category"
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="description" className="text-white font-semibold mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                placeholder="Descrição do produto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="value" className="text-white font-semibold mb-1">
                Preço
              </label>
              <Input
                name="value"
                type="number"
                placeholder="Preço (R$)"
                value={price === 0 ? "" : price.toString()}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="value" className="text-white font-semibold mb-1">
                Promoção
              </label>
              <Input
                name="value"
                type="text"
                placeholder="Digite a porcentagem de desconto (ex: 15)"
                value={discount === 0 ? "" : discount.toString()}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white transition"
              />
            </div>

            <p className="text-white font-semibold mb-1">Imagem atual do produto</p>
            <div className="mx-auto my-4" style={{ width: "150px" }}>
                    <Image
                    style={{ borderRadius: "12px" }}
                    alt="Imagem do Produto"
                    src={productImage || '/noimage.png'}
                    width={150}
                    height={150}
                    />
                  </div>

            {publicId && (
              <div className="mx-auto my-4" style={{ width: "150px" }}>
                <AdvancedImage
                  style={{ borderRadius: "12px" }}
                  cldImg={cld.image(publicId)}
                  plugins={[responsive(), placeholder()]}
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">Mudar imagem do produto</label>
              <CloudinaryUploadWidget
                uwConfig={{
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
                  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
                  cropping: true,
                }}
                setPublicId={setPublicId}
                />
            </div>


            <button
              type="submit"
              className="p-3 mt-4 bg-black text-white rounded-lg border border-white hover:bg-gray-800 transition-colors disabled:bg-gray-500"
              disabled={uploading}
            >
              {uploading
                ? "Enviando..."
                : selectedProduct
                ? "Atualizar Produto"
                : "Adicionar Produto"}
            </button>
          </form>
        </Box>

        {/* Tabela de Produtos */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-black text-white">
                <TableHead className="w-[100px]">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Editar</TableHead>
                <TableHead className="text-right">Excluir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products
                ?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-800 transition-colors">
                    <TableCell className="p-3">
                      <Image
                        width={50}
                        height={50}
                        alt="Imagem do produto"
                        src={product.imageUrl}
                        className="rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="p-3 max-w-xs break-words text-white">
                      {product.name}
                    </TableCell>
                    <TableCell className="p-3 w-1.5 break-words text-white">
                      {product.description}
                    </TableCell>
                    <TableCell className="p-3 text-right font-semibold text-white">
                      {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <Button
                        variant="outline"
                        className="bg-black text-white hover:bg-gray-800 transition-colors"
                        onClick={() => handleEdit(product)}
                      >
                        <LucidePencil />
                      </Button>
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <Button
                        variant="outline"
                        className="bg-black text-white hover:bg-gray-800 transition-colors"
                        onClick={() => handleDelete(product.id)}
                      >
                        <LucideTrash size={25} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Controles de Paginação */}
          <div className="flex justify-end items-center gap-4 mt-6">
            <Button
              variant="outline"
              className="bg-black text-white hover:bg-gray-800 transition-colors"
              onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="px-4 text-white">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              className="bg-black text-white hover:bg-gray-800 transition-colors"
              onClick={() => setCurrentPage((current) => Math.min(current + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-black text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja excluir este produto?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black text-white hover:bg-gray-800 transition-colors">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddProduct;
