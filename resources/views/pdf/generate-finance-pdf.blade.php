<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Išlaidu ataskaita</title>
    <!-- Įtraukiame Bootstrap stiliaus nuorodą -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <!-- Įtraukiame Chart.js biblioteką -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* Apply border to table cells */
        th, td {
            border-top: 1px;
            border: 1px solid black;
            padding: 8px; /* Pridedame atstumą, kad būtų geriau skaityti */
        }

        /* Apply border to table headers */
        th {
            background-color: #f2f2f2; /* Pridedame fono spalvą lentelės antraštėms */
        }
    </style>
     <style>
        @font-face {
            font-family: 'font_family';
            font-style: normal;
            font-weight: normal;
            src: url(http://example.com/fonts/Open_Sans/static/OpenSans_Condensed-Bold.ttf) format('truetype');
        }
    </style>
</head>

<body>

    <h1 style="font-family: font_family, sans-serif;">{{ $title }}</h1>
    <p>{{ $date }}</p>
    <br />
    <br />
   

    <h2 style="font-family: font_family, sans-serif;">Išlaių duomenys</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Data</th>
                <th>Suma</th>
                <th>Kategorija</th>
            </tr>
        </thead>
        <tbody>
            @foreach($financeData as $finance)
            <tr>
                <td>{{ $finance->start_date }}</td>
                <td>{{ $finance->sum }}</td>
                <td>{{ $finance->category }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Kategoriju sumos</h2>
    <table class="table">
        <thead>
            <tr>
                <th>Kategorija</th>
                <th>Bendra suma</th>
            </tr>
        </thead>
        <tbody>
            @foreach($categorySums as $categorySum)
            <tr>
                <td>{{ $categorySum->category }}</td>
                <td>{{ $categorySum->total_sum }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <!-- Atvaizduojame tuščią diagramą 
    <canvas id="pieChart" width="400" height="400"></canvas>
    <script>
        // Prieigą prie diagramos duomenų, paduotų iš valdiklio
        var chartData = {!! $chart->script() !!};
        // Vykdome diagramos skriptą
        eval(chartData);
    </script>-->
    
</body>


</html>
