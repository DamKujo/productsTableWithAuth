import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Field, FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { toast } from "react-hot-toast";

export function AddNewItem() {
  const handleClose = () => {
    toast.success("Successfully toasted!");
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="bg-blue-700 cursor-pointer p-4"
          >
            <img src="src/app/assets/plus-in-circle.svg" alt="add" /> Добавить
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Добавление нового продукта</DialogTitle>
            <DialogDescription>
              Здесь вы можете добавить новый продукт в каталог. Пожалуйста,
              заполните все поля и нажмите "Добавить новый продукт".
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Наименование</Label>
              <Input id="name" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="price">Цена</Label>
              <Input id="price" name="price" defaultValue="$499" />
            </Field>
            <Field>
              <Label htmlFor="brand">Вендор</Label>
              <Input id="brand" name="brand" defaultValue="Nike" />
            </Field>
            <Field>
              <Label htmlFor="article">Артикл</Label>
              <Input id="article" name="article" defaultValue="SKU-001" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose className="text-black">Закрыть</DialogClose>
            <DialogClose onClick={handleClose}>
              Добавить новый продукт
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
