import iconUrl from "@assets/icon.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authSchema, AuthData } from "@/shared/types/schema";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commonPostRequest } from "@/shared/api/instance";
import { useSession } from "@/shared/model/session";
import { EXPIRES_AT } from "@/shared/model/config";
import { useLogin } from "../model/use-login";

export default function AuthCard() {
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthData> = async (data) => {
    const user = await useLogin(data, rememberMe, setError);
    if (user) {
      navigate("/products");
    }
  };

  return (
    <Card className="w-full max-w-sm p-8 bg-linear-to-b from-gray-50 to-white border-4 border-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <CardHeader className="gap-3">
        <div className="flex justify-center align-middle">
          <img src={iconUrl} alt="icon" />
        </div>
        <CardTitle className="text-center text-3xl">
          Добро пожаловать!
        </CardTitle>
        <CardDescription className="text-center">
          Пожалуйста, авторизуйтесь
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="login">Login</Label>
              <Input
                {...register("login")}
                id="login"
                type="text"
                placeholder="test"
              />
              {errors.login && (
                <p className="text-red-700">{errors.login.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input {...register("password")} id="password" type="password" />
              {errors.password && (
                <p className="text-red-700">{errors.password.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Checkbox
                id="terms"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMe(!!checked)}
              />
              <Label
                htmlFor="terms"
                className="font-normal text-muted-foreground"
              >
                Запомнить данные
              </Label>
            </div>
          </div>
          <div className="mt-3">
            <Button
              type="submit"
              size={"lg"}
              className="w-full bg-blue-700 hover:bg-blue-800"
            >
              {isSubmitting ? "Загрузка..." : "Войти"}
            </Button>
            {errors.root && (
              <p className="text-red-700">{errors.root.message}</p>
            )}
          </div>
          <div className="flex justify-center items-center text-gray-300 mt-3">
            <p>_____________________</p>
            <p>или</p>
            <p>_______________________</p>
          </div>
          <div className="mt-3 text-center">
            <p>
              Нет аккаунта?{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Cоздать
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
