<script id="template_historical" type="text/template">
    <hr>
    <div class="card mb-4">
        <div class="card-header text-muted"><%= historical[i].timestamp %></div>
        <div class="card-body">
          <h5 class="card-title"><%= historical[i].voter %> a voté</h5>
          <p class="card-text">
            <%= historical[i].proposal_title %>
          </p>
        </div>
        <div class="card-footer text-muted">Tx : <%= historical[i].hash %></div>
    </div>
</script>