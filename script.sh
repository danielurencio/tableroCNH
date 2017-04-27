A() {
#  mkdir A;
  for i in 1 2 3 4 5; do
    xlsx2csv -s $i "cnh_numeros_ejercicio A.xlsx" $i.csv;
    mv ${i}.csv A;
    echo "Se extrajó la pestaña ${i}";
  done
}

B() {
  xlsx2csv "Producción de asignaciones por pozo.xlsx" B.csv;
  sed -i '1,8d' B.csv;
}
