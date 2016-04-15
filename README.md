# DeOlho - Plataforma de monitoramento coletivo de convênios

##Descrição

O DeOlho é um projeto criado para o [Concurso de Aplicativos para enfrentamento da corrpupção](http://justica.gov.br/labpi), lançado pelo Ministério da Justiça.

O aplicativo (para as plataformas Android e iOS) propõe-se a incentivar a participação cidadã na fiscalização do uso do dinheiro público. Para esse fim, o app mapeia as entidades receptoras de convênios (transferências de dinheiro público) na cidade do usuário, e as classifica de acordo com o status de seus convênios. Através dessa interface, o cidadão pode facilmente visualizar as entidades receptoras de transferências de dinheiro público próximas de si, e fiscalizar a atuação dessas entidades.

O aplicativo encontra-se atualmente em estado de protótipo. Entre várias funcionalidades que encontram-se incompletas, ressaltamos as seguintes:

* O aplicativo mapeia um número limitado de proponentes de convênios para reduzir a quantidade de chamadas HTTP realizadas
* O aplicativo usa o mesmo tipo de marcador para a posição do usuário e as posições de proponentes de convênios
* Ainda não é possível visualizar os convênios de um dado proponente (embora os dados já sejam captados pelo aplicativo, eles ainda não são apresentados ao usuário)
* Os marcadores ainda não estão sendo coloridos baseado no status do convênio

Estas e outras limitações devem ser reduzidas ao longo das próximas semanas.

##Instalação

O DeOlho é um app mobile construído utilizando tecnologias web, utilizando a plataforma [Ionic](http://ionicframework.com/).

Quando estiver completo, o DeOlho será distribuído através das respectivas lojas de aplicativos de cada plataforma suportada por ele. Por enquanto, o DeOlho está disponível apenas em "modo desenvolvedor", ou seja, é necessário que o usuário gere os pacotes do aplicativo ele mesmo.

**NOTA**: Todos os comandos listados a seguir podem requerer permissões de administrador (Por exemplo, caso no Linux ou no Mac OS, pode ser necessário prefixar os comandos com o comando `sudo`)

Para instalar e executar o DeOlho, o usuário deverá ter a plataforma Ionic e o gerenciador de pacotes [NPM](https://www.npmjs.com) instalados em seu computador. Com essas dependências satisfeitas, deve-se executar o seguinte comando na pasta onde o DeOlho foi baixado:

```
npm install 

```

Esse comando irá preparar todas as bibliotecas que o DeOlho necessita para ser compilado. A seguir, o usuário deve especificar em qual plataforma deseja usar o DeOlho. Isso é feito rodando o seguinte comando na pasta do DeOlho:

```
ionic platform <plataforma>

```

Onde "<plataforma>" deve ser substituído por "android" ou "ios". (É importante ressaltar que o DeOlho pode ser compilado para iOS apenas em computadores da marca Apple, pois as ferramentas de desenvolvimento para iOS não estão disponíveis em outras plataformas). Esse comando pode ser rodado várias vezes com plataformas diferentes caso se deseje compilar o DeOlho para diversas plataformas. 

Finalmente, para criar o pacote a ser instalado no smartphone, deve-se rodar o seguinte comando, ainda na pasta do DeOlho:

```
ionic build

```
Esse comando irá compilar o DeOlho para as plataformas desejadas, gerando um arquivo .apk (para o Android) e/ou um arquivo .ipa (para o iOS). Esses arquivos podem então ser instalados no dispositivo móvel de preferência do usuário, através dos métodos específicos para a plataforma desejada.

**NOTA**: Para que a compilação do DeOlho ocorra corretamente, o usuário deverá ter as ferramentas de desenvolvimento Android (Android SDK) instaladas em sua máquina, além do ambiente de desenvolvimento JDK, caso esteja compilando para o Android, e deverá ter as ferramentas de desenvolvimento iOS (XCode) instaladas em sua máquina caso esteja compilando para o iOS.

Adicionalmente, caso o usuário deseje, o DeOlho pode ser testado no browser, exibindo simultaneamente as interfaces do aplicativo para Android e do aplicativo para iOS, rodando o seguinte comando na pasta do DeOlho:

```

ionic serve --lab 

```
Esse comando irá abrir uma janela do browser web do computador que exibe simulações do DeOlho tanto no Android quanto no iOS.


##Licença

O DeOlho é licenciado pela licença GNU GPL v2, que é incluída neste repositório na íntegra (no arquivo LICENCE), e também pode ser visualizada [neste link](http://www.gnu.org/licenses/old-licenses/gpl-2.0.html), ou em português [neste link](http://www.magnux.org/doc/GPL-pt_BR.txt). A versão em português é uma tradução não-oficial, NÃO POSSUI validade legal e está linkada aqui para fins de simples conferência. Em caso de qualquer divergência entre a versão em inglês e a versão em português da licença, a versão em inglês é considerada como sendo a versão válida.