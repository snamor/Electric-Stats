Optimitzador Elèctric
=====================

Requisits
---------
Actualment l'aplicació nomès funciona per a les dades extretes a través de la plataforma [**Engage**][6].

És per això que fa falta un __sensor Engage de la marca Efergy__ connectat a la citada plataforma.

Com funciona?
-------------

### Generació de l'informe
Per a fer funcionar l'aplicació primer caldrà generar un informe a través de la plataforma Engage. 
Els passos a seguir són els següents:

1. Entrar a http://engage.efergy.com.
2. Accedir a l'apartat "informes".
3. Seleccionar resolució "minuts".
4. Seleccionar un mes.
5. Seleccionar "privat" (No és necessari, però sí recomanable).
6. Clicar "continuar".
7. Esperar que es generi l'informe, que ha de tenir un nom del tipus engage\_report\_mm\_yyyy\_minute.csv.
8. Descarregar l'informe.

### Importació de l'informe
Un cop generat l'informe caldrà importar-lo a l'aplicació de optimització

1. Seleccionar a quina hora comença la tarifa punta.
2. Seleccionar a quina hora acaba la tarifa punta.
3. Seleccionar el fitxer que hem generat a la plataforma Efergy.

Un cop fet això es mostraran el resultat de l'anàlisi de les dades importades.


Ús fora de línia
----------------
L'aplicació no envia la informació del consum a través d'internet. 

Tota la informació es processa a l'ordinador mitjançant javascript.

Tot i així, si es prefereix es pot descarregar l'aplicació i funcionar sense connexió a internet.

Crèdits
-------
L'aplicació fa ús de les següents llibreries per a funcionar:

* [**Bootstrap**][1]
* [**HighCharts**][2]
* [**i18next**][3]
* [**jQuery**][4]
* [**jQuery-csv**][5]

[1]: http://getbootstrap.com
[2]: http://www.highcharts.com
[3]: http://i18next.com
[4]: http://jquery.com
[5]: http://code.google.com/p/jquery-csv/
[6]: http://engage.efergy.com