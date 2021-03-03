<script id="template_historical" type="text/template">
    <hr>
    <div class="card mb-4">
        <div class="card-header text-muted">{{ timestamp }}</div>
        <div class="card-body">
          <h5 class="card-title">{{ voter }} a voté</h5>
          <p class="card-text">
            {{ proposal_title }}
          </p>
        </div>
        <div class="card-footer text-muted">Tx : {{ hash}}</div>
    </div>
</script>