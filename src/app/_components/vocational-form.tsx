"use client";

import { z } from 'zod'
import { Card } from '@/components/ui/card';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const basicInfoSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  idade: z.number().min(14, { message: "Idade mínima é 14 anos" }).max(100, { message: "Idade máxima é 100 anos" }),
  escolaridade: z.enum(["fundamental", "medio", "superior", "pos_graduacao"], {
    message: "Selecione uma opção de escolaridade"
  }),
  area_interesse: z.enum(["tecnologia", "saude", "educacao", "negocios", "arte_design", "gastronomia", "beleza_estetica", "turismo_hospitalidade", "industria", "servicos"], {
    message: "Selecione uma área de interesse"
  }),
  disponibilidade: z.enum(["integral", "matutino", "vespertino", "noturno", "fins_de_semana"], {
    message: "Selecione sua disponibilidade"
  })
})

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface VocationalFormProps {
  onSubmit: (data: BasicInfoFormData) => void;
  onBack: () => void;
}

export function VocationalForm({ onSubmit, onBack }: VocationalFormProps) {
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      nome: "",
      idade: undefined,
      escolaridade: undefined,
      area_interesse: undefined,
      disponibilidade: undefined,
    },
  })

  const escolaridadeOptions = [
    { value: "fundamental", label: "Ensino Fundamental" },
    { value: "medio", label: "Ensino Médio" },
    { value: "superior", label: "Ensino Superior" },
    { value: "pos_graduacao", label: "Pós-graduação" },
  ];

  const areaInteresseOptions = [
    { value: "tecnologia", label: "Tecnologia e Informática" },
    { value: "saude", label: "Saúde e Bem-estar" },
    { value: "educacao", label: "Educação e Ensino" },
    { value: "negocios", label: "Negócios e Gestão" },
    { value: "arte_design", label: "Arte e Design" },
    { value: "gastronomia", label: "Gastronomia e Culinária" },
    { value: "beleza_estetica", label: "Beleza e Estética" },
    { value: "turismo_hospitalidade", label: "Turismo e Hospitalidade" },
    { value: "industria", label: "Indústria e Produção" },
    { value: "servicos", label: "Serviços e Atendimento" },
  ];

  const disponibilidadeOptions = [
    { value: "integral", label: "Período Integral" },
    { value: "matutino", label: "Período Matutino" },
    { value: "vespertino", label: "Período Vespertino" },
    { value: "noturno", label: "Período Noturno" },
    { value: "fins_de_semana", label: "Fins de Semana" },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className='border-0 shadow-2xl bg-white/90 backdrop-blur-sm'>
          <div className='p-8'>

            <div className='text-center mb-8'>
              <div className='flex items-center justify-center mb-4 mx-auto'>
                <User className='w-12 h-12 text-blue-600' />
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>Vamos nos conhecer!</h1>
              <p className='text-gray-600'>Conte-nos um pouco sobre você para personalizarmos seu teste</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >

                {/* Nome e Idade */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='Digite seu nome completo...'
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="idade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Idade</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            {...form.register("idade", {
                              setValueAs: (v) => v === "" ? undefined : Number(v),
                            })}
                            placeholder='Ex: 25'
                            className="border-gray-300 focus:border-blue-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Escolaridade */}
                <FormField
                  control={form.control}
                  name="escolaridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Escolaridade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full border-gray-300 focus:border-blue-500'>
                            <SelectValue placeholder="Selecione sua escolaridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {escolaridadeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Área de Interesse */}
                <FormField
                  control={form.control}
                  name="area_interesse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Área de maior interesse</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full border-gray-300 focus:border-blue-500'>
                            <SelectValue placeholder="Selecione a área que mais te interessa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {areaInteresseOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Disponibilidade */}
                <FormField
                  control={form.control}
                  name="disponibilidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Disponibilidade para estudar</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full border-gray-300 focus:border-blue-500'>
                            <SelectValue placeholder="Selecione sua disponibilidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {disponibilidadeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Botões */}
                <div className="flex justify-between pt-6">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                  
                  <Button 
                    type="submit"
                    className='bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white flex items-center gap-2'
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </form>
            </Form>

          </div>
        </Card>
      </motion.div>
    </div>
  )
}